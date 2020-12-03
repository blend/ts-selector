export default class NotHasKeyNode implements ISelector {
    constructor(key: string);
    key: string;
    matches(labels: Map<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
