


export interface ProcessLifecycle {
    initialize?: () => Promise<void>
    beforeWindowCreated?: () => Promise<void>
    onGUIShown?: () => Promise<void>
    onGUIHidden?: () => Promise<void>
    onExit?: () => Promise<void>
}
