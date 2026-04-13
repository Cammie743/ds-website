import Foundation
import AVFoundation
import AppKit

let videoPath = "/Users/cameronfoster/Desktop/GMT20260412-021525_Clip_Cam Foster's Clip 04_11_2026.mp4"
let outDir = "/Users/cameronfoster/Documents/Cursor Projects/ds-website/.tmp-clip/frames"

let url = URL(fileURLWithPath: videoPath)
let asset = AVURLAsset(url: url)
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero

let dur = CMTimeGetSeconds(asset.duration)
print("duration_sec=\(dur)")

try FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)

var t = 0.0
var i = 0
let step = 0.08
let maxT = min(dur + 0.01, 5.0)

while t <= maxT {
    let time = CMTime(seconds: t, preferredTimescale: 600)
    do {
        let cgImage = try gen.copyCGImage(at: time, actualTime: nil)
        let bitmap = NSBitmapImageRep(cgImage: cgImage)
        guard let data = bitmap.representation(using: .png, properties: [:]) else {
            print("no png at t=\(t)")
            break
        }
        let out = "\(outDir)/frame_\(String(format: "%04d", i)).png"
        try data.write(to: URL(fileURLWithPath: out))
        print("wrote \(out)")
    } catch {
        print("error at t=\(t): \(error)")
    }
    t += step
    i += 1
}
