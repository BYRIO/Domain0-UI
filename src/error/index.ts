import { message } from 'antd';
import { JointContent } from 'antd/es/message/interface';
import { AxiosError, AxiosResponse } from 'axios';
import { useEffect } from 'react';

export type MessageType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export class MessageError extends Error {
  constructor(
    public type: MessageType,
    public content: JointContent,
    // eslint-disable-next-line no-unused-vars
    public duration?: number,
  ) {
    super(`Message ${type}: ${content}`);
  }
}

export function catchCommonResponseError<T extends AxiosResponse>(
  req: Promise<T>,
): Promise<T> {
  return req.catch((err) => {
    if (err instanceof MessageError) {
      throw err;
    }
    if (err instanceof AxiosError) {
      if (
        err.response?.status &&
        err.response.status >= 400 &&
        err.response.status < 500
      ) {
        const body = err.response.data;
        if (typeof body === 'string') {
          throw new MessageError('warning', body);
        } else if (typeof body === 'object') {
          throw new MessageError(
            'warning',
            body.errors ||
              body.message ||
              `你可能缺少权限而被禁止操作(${err.response.status}-#9567)`,
          );
        } else {
          throw new MessageError('warning', err.response.statusText);
        }
      }
      if (err.response?.status && err.response.status >= 500) {
        throw new MessageError('error', err.response.statusText);
      }
    }
    throw err;
  });
}

export function useError(error: Error | null | undefined) {
  useEffect(() => {
    if (error instanceof MessageError) {
      message[error.type](error.content, error.duration);
    } else if (error instanceof Error) {
      console.error(error);
      message.error(error.message);
    } else if (error) {
      console.error(error);
      message.error(String(error));
    }
  }, [error]);
}
