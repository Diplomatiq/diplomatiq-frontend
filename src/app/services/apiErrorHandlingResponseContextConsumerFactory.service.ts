import { Injectable } from '@angular/core';
import { DiplomatiqApiErrorErrorCodeEnum, DiplomatiqApiErrorFromJSON, ResponseContext } from '../../openapi/api';
import { DiplomatiqApiException } from '../exceptions/diplomatiqApiException';

@Injectable({
    providedIn: 'root',
})
export class ApiErrorHandlingResponseContextConsumerFactoryService {
    public getResponseContextConsumer(): (context: ResponseContext) => Promise<Response | void> {
        return async (context: ResponseContext): Promise<Response | void> => {
            if (!context.response.ok) {
                try {
                    const apiErrorJson = await context.response.json();
                    const diplomatiqApiError = DiplomatiqApiErrorFromJSON(apiErrorJson);
                    throw new DiplomatiqApiException(diplomatiqApiError.errorCode, diplomatiqApiError.retryInformation);
                } catch (ex) {
                    throw new DiplomatiqApiException(DiplomatiqApiErrorErrorCodeEnum.InternalServerError);
                }
            }
        };
    }
}
