export default class EqualsNode implements ISelector {
    key: string;
    value: string;
    constructor(key: string, value: string);
    matches(labels: Map<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
