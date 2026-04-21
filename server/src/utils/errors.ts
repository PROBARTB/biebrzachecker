export class NotFoundError extends Error {
    constructor(message = "No data found") {
        super(message);
        this.name = "NotFoundError";
    }
}

export class ExternalServiceError extends Error {
    constructor(message = "External service error or unavailable") {
        super(message);
        this.name = "ExternalServiceError";
    }
}

export class ExternalServiceInvalidResponseError extends Error {
    constructor(message = "External service returned an unexpected response") {
        super(message);
        this.name = "ExternalServiceInvalidResponseError";
    }
}

export const fetchErrorHandler = (err: any, context: string, res: any) => {
    console.error(`Error while ${context}: `, err);

    if (err instanceof NotFoundError) return res.status(404).json({ message: err.message });
    if (err instanceof ExternalServiceError) return res.status(502).json({ message: err.message });
    if (err instanceof ExternalServiceInvalidResponseError) return res.status(503).json({ message: err.message });

    return res.status(500).json({ message: "Failed to fetch. Internal Server Error." });
}