
// 处理query 传参的时候导致的空字符串查询问题（后端不愿意给处理）
export const formatQuery = (query: any ={})=>{
  let ret: any = {}
  Object.keys(query).map((key)=>{
    if( query[key] !== null && query[key] !== undefined && query[key]!=='' ){
      ret[key] = query[key]
    }
  })
  return ret
}

export function withTry<T=any> (func: Function) {
  return async function(...args: any[]): Promise<[any, T | null]> {
    try {
      const data = await func(...args)
      return [null, data]
    }catch(err) {
      return [err, null]
    }
  }
}

export async function sleep(time: number=1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}