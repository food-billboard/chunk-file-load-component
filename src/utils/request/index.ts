import axios, { AxiosRequestConfig } from 'axios'
import Qs from 'qs'
import { formatQuery } from '../tool'

export interface IRequestOptions extends AxiosRequestConfig {
  file?: boolean 
}

const DEFAULT_REQUEST_SETTING: Partial<IRequestOptions> = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
}

const axiosInstance = axios.create(DEFAULT_REQUEST_SETTING)

export const request = async <ResBody=any>(url: string, setting: IRequestOptions={}): Promise<ResBody> => {
  // 过滤URL参数
  const { params, data, file=false, ...options } = setting

  let body: any
  let error: any

  try{
    body = await axiosInstance(url, {
      ...options,
      ...(data ? { data: file ? data : Qs.stringify(data) } : {}),
      ...(params ? { params: formatQuery(params) } : {}),
    })
  } catch(err) {
    error = err
  }

  // 报错分为两种，
  // 系统错误，由 httpClient 拦截到的错误 如，4xx，5xx
  if(error){
    error.errorType = 'system';
    error.messageType = 'response';
    throw error
  }

  // 业务错误，客户端返回的 statusCode === 200 但是response.body 中的success 返回为 false的错误
  if(body && body?.data?.success === false) {
    error = body
    error.errorType = 'logic'
    error.messageType = 'body'
  }

  // 返回真正的response body res 内容
  if(!error) {
    return body as ResBody
  }
  throw error
}

const REQUEST_CACHE_SCHEMA = "__chunk_file_upload_cache__"

export const requestCacheSchemaGet = () => {
  const cache = localStorage.getItem(REQUEST_CACHE_SCHEMA)
  try {
    return JSON.parse(cache!)
  }catch(err) {
    return {
      body: "",
      upload: "",
      exist: ""
    }
  }
}

export const requestCacheSchemaSet = (value: string | { body: string, exist: string, upload: string }) => {
  const storeData = typeof value === 'string' ? value : JSON.stringify(value)
  localStorage.setItem(REQUEST_CACHE_SCHEMA, storeData)
}