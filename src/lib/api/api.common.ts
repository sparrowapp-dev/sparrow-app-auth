/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type Method } from 'axios';
import type { RequestData } from '../utils/dto/requestdata';
import { isLoading } from '$lib/store/auth.store';

interface MakeRequestResponse {
	status: 'success' | 'error';
	isSuccessful: boolean;
	message: string;
	data: any;
	tabId: string;
}

const error = (error: string, data?: any, tabId: string = ''): MakeRequestResponse => {
	return {
		status: 'error',
		isSuccessful: false,
		message: error,
		data,
		tabId
	};
};

const success = (data: any, tabId: string): MakeRequestResponse => {
	return {
		status: 'success',
		isSuccessful: true,
		message: '',
		data,
		tabId
	};
};

const makeRequest = async (method: Method, url: string, requestData?: RequestData) => {
	isLoading.set(true);
	try {
		const response = await axios({
			method: method,
			url: url,
			data: requestData?.body,
			headers: requestData?.headers
		});

		if (response.status === 201 || response.status === 200) {
			return success(response.data, '');
		} else {
			return error(response.data.message);
		}
	} catch (e: any) {
		if (e.response.data) {
			return error(e.response.data.message);
		}
		return error(e);
	} finally {
		isLoading.set(false);
	}
};

export { makeRequest };
