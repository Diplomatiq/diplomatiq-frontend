import { DiplomatiqApiError, DiplomatiqApiErrorErrorCodeEnum, RetryInformation } from '../../openapi/api';

export class DiplomatiqApiException extends Error implements DiplomatiqApiError {
    public constructor(
        public readonly errorCode: DiplomatiqApiErrorErrorCodeEnum,
        public readonly retryInformation?: RetryInformation,
    ) {
        super();
        this.message = errorCode;
    }
}
