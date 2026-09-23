// Framer code component: embeds the Beyond the Product page and grows to fit it
// (no nested scrollbar). In Framer: Assets → Code → "+" → New Code File,
// paste this file in, then drag "BeyondTheProductEmbed" onto the canvas.
// Set its Width to Fill and its Height to Fit.

import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function BeyondTheProductEmbed(props) {
    const { src, minHeight } = props
    const frame = useRef<HTMLIFrameElement>(null)
    const [height, setHeight] = useState<number>(minHeight)

    useEffect(() => {
        let origin = ""
        try {
            origin = new URL(src).origin
        } catch (e) {}

        const onMessage = (e: MessageEvent) => {
            // Only trust messages from our own iframe / GitHub Pages origin
            if (!frame.current || e.source !== frame.current.contentWindow) return
            if (origin && e.origin !== origin) return
            const d = e.data
            if (d && d.type === "beyond-the-product:height" && typeof d.height === "number") {
                setHeight(Math.max(minHeight, Math.ceil(d.height)))
            }
        }
        window.addEventListener("message", onMessage)
        return () => window.removeEventListener("message", onMessage)
    }, [src, minHeight])

    const askForHeight = () => {
        frame.current?.contentWindow?.postMessage({ type: "beyond-the-product:request-height" }, "*")
    }

    return (
        <iframe
            ref={frame}
            src={src}
            title="Beyond the Product — visual work by Jennifer Robertson"
            scrolling="no"
            onLoad={askForHeight}
            style={{
                display: "block",
                width: "100%",
                height,
                border: 0,
                overflow: "hidden",
                background: "#4e7fcb",
            }}
        />
    )
}

BeyondTheProductEmbed.defaultProps = {
    src: "https://YOUR-GITHUB-USERNAME.github.io/beyond-the-product/",
    minHeight: 900,
}

addPropertyControls(BeyondTheProductEmbed, {
    src: { type: ControlType.String, title: "Page URL" },
    minHeight: { type: ControlType.Number, title: "Min height", min: 200, max: 4000, step: 50 },
})
