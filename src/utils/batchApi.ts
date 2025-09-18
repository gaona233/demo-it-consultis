import { useState, useEffect } from 'react';

export function useProgressiveFetch(urls:string[], { concurrentLimit = 5 } = {}) {
  const [items, setItems] = useState<string[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(urls?.length == 0){
        return
    }
    let isMounted = true;
    const activeRequests = new Set();

    const processBatch = async () => {
      try {
        setIsLoading(true);
        
        // 使用数组来追踪每个URL的状态
        const pendingUrls = [...urls];
        const results = Array(urls.length).fill(null);
        
        while (pendingUrls.length > 0 && isMounted) {
          // 当前批次URL
          const batch = pendingUrls.splice(0, concurrentLimit);
          const batchPromises = batch.map(async (url, index) => {
            const originalIndex = urls.indexOf(url);
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const data = await response.json();
              if (isMounted) {
                results[originalIndex] = { data, error: null };
                // 只更新非null的结果
                setItems(prev => {
                  const newItems = [...prev];
                  newItems[originalIndex] = data;
                  return newItems.filter(item => item !== null && item !== undefined);
                });
                setCompletedCount(prev => prev + 1);
              }
            } catch (err:any) {
              if (isMounted) {
                results[originalIndex] = { data: null, error: err.message };
                setCompletedCount(prev => prev + 1);
              }
            }
          });
          
          activeRequests.add(Promise.allSettled(batchPromises));
        }
        
        await Promise.all([...activeRequests]);
      } catch (err:any) {
        setError(err.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    processBatch();

    return () => {
      isMounted = false;
      // 在这里可以添加请求取消逻辑
    };
  }, [urls, concurrentLimit]);

  return {
    items,          // 已获取的数据项数组
    isLoading,      // 是否还有请求在进行中
    progress: urls.length > 0 
      ? Math.round((completedCount / urls.length) * 100) 
      : 0,          // 完成的百分比
    error,          // 错误信息
    completedCount, // 已完成的请求数
    totalCount: urls.length // 总请求数
  };
}
 