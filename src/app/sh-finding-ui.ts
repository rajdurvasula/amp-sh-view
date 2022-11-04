export class ShFindingUi {
    id: ControlData;
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

export class ControlData {
    identifier: string;
    product: string;
    region: string;
    account: string;
    name: string;
    version: string;
    index: string;
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

