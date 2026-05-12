const allowedEvents = new Set(["FILE_UPDATE", "FILE_VERSION_UPDATE"]);

module.exports = async function figmaWebhook(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  let payload;

  try {
    payload = await readJson(request);
  } catch {
    return sendJson(response, 400, { ok: false, error: "Invalid JSON payload" });
  }

  const expectedPasscode = process.env.FIGMA_WEBHOOK_PASSCODE;
  if (!expectedPasscode) {
    return sendJson(response, 500, { ok: false, error: "FIGMA_WEBHOOK_PASSCODE is not configured" });
  }

  if (payload.passcode !== expectedPasscode) {
    return sendJson(response, 400, { ok: false, error: "Invalid passcode" });
  }

  if (payload.event_type === "PING") {
    return sendJson(response, 200, { ok: true, event: "PING" });
  }

  if (!allowedEvents.has(payload.event_type)) {
    return sendJson(response, 200, { ok: true, ignored: true, reason: "Unsupported event type" });
  }

  const expectedFileKey = process.env.FIGMA_WEBHOOK_FILE_KEY;
  if (expectedFileKey && payload.file_key !== expectedFileKey) {
    return sendJson(response, 200, { ok: true, ignored: true, reason: "Unexpected file key" });
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl) {
    return sendJson(response, 500, { ok: false, error: "VERCEL_DEPLOY_HOOK_URL is not configured" });
  }

  const deployResponse = await fetch(deployHookUrl, { method: "POST" });

  if (!deployResponse.ok) {
    return sendJson(response, 502, {
      ok: false,
      error: "Deploy hook request failed",
      status: deployResponse.status,
    });
  }

  return sendJson(response, 200, {
    ok: true,
    event: payload.event_type,
    fileKey: payload.file_key,
    deploymentTriggered: true,
  });
};

async function readJson(request) {
  if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) {
    return request.body;
  }

  if (typeof request.body === "string") {
    return request.body ? JSON.parse(request.body) : {};
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
}
