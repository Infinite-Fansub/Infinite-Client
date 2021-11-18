import InfiniteClient from "../bot-2";
import { EventOptions } from "../types";
/**
 * @deprecated use the interface instead
 */
export default class Event {
    public name?: string;
    public event: string;
    public type: "on" | "once";
    public enabled: boolean;
    public client?: InfiniteClient;

    constructor(options: EventOptions) {
        this.name = options!.name;
        this.event = options!.event;
        this.type = options?.type ?? "on";
        this.enabled = options?.enabled ?? true;
    }
}