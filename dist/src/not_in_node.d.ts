export default class NotInNode implements ISelector {
    key: string;
    values: string[];
    constructor(key: string, values: string[]);
    matches(labels: Record<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
