namespace pxsim {
    namespace _protocol {
        export interface ArcadeShieldMessage {
            type: "show-image" | "set-brightness" | "set-palette"
            runId: string
        }
        export interface ShowImageMessage extends ArcadeShieldMessage {
            type: "show-image"
            data: string
        }     
        export interface SetBrightnessMessage extends ArcadeShieldMessage {
            type: "set-brightness"
            value: number
        }
        export interface SetPaletteMessage extends ArcadeShieldMessage {
            type: "set-palette"
            data: string
        }
    }

    //% fixedInstance
    class ScreenState {
        runId: string;
        brightness: number;

        constructor() {
            this.runId = Math.random() + "";
        }

        bpp(): number {
            return 4; // TODO: Do we need to support legacy 2bpp mode?
        }

        displayHeight(): number {
            return 128;
        }

        displayWidth(): number {
            return 160;
        }

        displayPresent(): boolean {
            return true;
        }

        private sendMessage(msg: string) {
            let encoder = new TextEncoder();
            let buf = encoder.encode(msg)
            Runtime.postMessage({
                type: "messagepacket",
                broadcast: false,
                channel: "arcadeshield",
                data: buf
            } as SimulatorControlMessage)
        }

        setScreenBrightness(b: number) {
            // NOTE: May need to cache locally for querying
            const msg: _protocol.SetBrightnessMessage = {
                type: "set-brightness",
                runId: this.runId,
                value: b
            }
            this.sendMessage(JSON.stringify(msg))
        }

        setPalette(buf: RefBuffer) {
            // NOTE: May need to cache locally for querying
            const msg: _protocol.SetPaletteMessage = {
                type: "set-palette",
                runId: this.runId,
                data: buf.data.toString()
            }
            this.sendMessage(JSON.stringify(msg))
        }

        updateStats(s: string) {
            // Ignore
        }

        showImage(img: RefImage) {
            // NOTE: May need to cache locally for querying
            const msg: _protocol.ShowImageMessage = {
                type: "show-image",
                runId: this.runId,
                data: img.data.toString()
            }
            this.sendMessage(JSON.stringify(msg))
        }
    }

    const _screenState: ScreenState = new ScreenState();

    export function getScreenState(): ScreenState {
        return _screenState;
    }
}
