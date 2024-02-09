/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type Method } from 'axios';
import type { RequestData } from '../utils/dto/requestdata';
import { getUserToken, getRefToken } from '$lib/utils/token';
import { refreshToken } from '$lib/services/auth.service';
import constants from '$lib/utils/constants';
import { setAuthJwt } from '$lib/utils/jwt';
import { isLoading } from '$lib/store/auth.store';
import { ErrorMessages } from '$lib/utils/enums/enums';

interface MakeRequestResponse {
	status: 'success' | 'error';
	isSuccessful: boolean;
	message: string;
	data: unknown;
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

const getAuthHeaders = () => {
	return {
		Authorization: `Bearer ${getUserToken()}`
	};
};

const getMultipartAuthHeaders = () => {
	return {
		'Content-Type': 'multipart/form-data',
		Authorization: `Bearer ${getUserToken()}`
	};
};

const getRefHeaders = () => {
	return {
		Authorization: `Bearer ${getRefToken()}`
	};
};

export const regenerateAuthToken = async (
	method: Method,
	url: string,
	requestData?: RequestData
) => {
	const response = await refreshToken();
	if (response.isSuccessful) {
		setAuthJwt(constants.AUTH_TOKEN, response.data.data.newAccessToken.token);
		setAuthJwt(constants.REF_TOKEN, response.data.data.newRefreshToken.token);
		if (requestData && requestData.headers) {
			requestData.headers = getAuthHeaders();
		}
		return await makeRequest(method, url, requestData);
	} else {
		throw 'error refresh token: ' + response.message;
	}
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
	} catch (e) {
		if (
			e.response?.data?.statusCode === 401 &&
			e.response?.data?.message === ErrorMessages.ExpiredToken
		) {
			return await regenerateAuthToken(method, url, requestData);
		} else if (
			e.response?.data?.statusCode === 401 &&
			e.response.data.message === ErrorMessages.Unauthorized
		) {
			await _viewModel.clientLogout();
			return error('unauthorized');
		}
		if (e.message) {
			return error(e.response.data.message);
		} else if (e.response.data) {
			return error(e.response.data.message);
		}
		return error(e);
	} finally {
		isLoading.set(false);
	}
};

export { makeRequest, getAuthHeaders, getRefHeaders, getMultipartAuthHeaders };
