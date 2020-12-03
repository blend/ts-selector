export default class NotHasKeyNode implements ISelector {
    constructor(key: string);
    key: string;
    matches(labels: Record<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
