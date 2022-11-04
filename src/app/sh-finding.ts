export class ShFinding {
    id: string;
    account: string;
    region: string;
    firstObservedAt: string;
    lastObservedAt: string;
    severity: string;
    compliance: string;
    title: string;
    description: string;
    remediation: Remediation;
    resources: Resource[];
}

export class Remediation {
    recommendation: Recommendation;
}

export class Recommendation {
    text: string;
    url: string;
}

export class Resource {
    id: string;
    type: string;
}
