// 模拟API请求
export async function fetchZkCards(): Promise<any[]> {
    try {
        // 假设你有一个HTTP服务器运行在 http://localhost:3000/
        // 并且你的JSON文件可以通过 /src/data/zk.json 访问
        const response = await fetch('/data/zk.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error('Error fetching zk cards:', error);
        throw error;
    }
}

// 模拟API请求
export async function fetchFwzyCards(): Promise<any[]> {
    try {
        // 假设你有一个HTTP服务器运行在 http://localhost:3000/
        // 并且你的JSON文件可以通过 /src/data/zk.json 访问
        const response = await fetch('/data/fwzy.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error('Error fetching fwzy cards:', error);
        throw error;
    }
}


// 模拟API请求
export async function fetchJbCards(): Promise<any[]> {
    try {
        // 假设你有一个HTTP服务器运行在 http://localhost:3000/
        // 并且你的JSON文件可以通过 /src/data/zk.json 访问
        const response = await fetch('/data/jb.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error('Error fetching jb cards:', error);
        throw error;
    }
}

// 模拟API请求
export async function fetchZbCards(): Promise<any[]> {
    try {
        // 假设你有一个HTTP服务器运行在 http://localhost:3000/
        // 并且你的JSON文件可以通过 /src/data/zk.json 访问
        const response = await fetch('/data/zb.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error('Error fetching zb cards:', error);
        throw error;
    }
}

// 模拟API请求
export async function fetchFwCards(): Promise<any[]> {
    try {
        // 假设你有一个HTTP服务器运行在 http://localhost:3000/
        // 并且你的JSON文件可以通过 /src/data/zk.json 访问
        const response = await fetch('/data/fw.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error('Error fetching fw cards:', error);
        throw error;
    }
}

// 模拟API请求
export async function fetchTzCards(): Promise<any[]> {
    try {
        // 假设你有一个HTTP服务器运行在 http://localhost:3000/
        // 并且你的JSON文件可以通过 /src/data/zk.json 访问
        const response = await fetch('/data/tz.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error('Error fetching tz cards:', error);
        throw error;
    }
}

// 模拟API请求
export async function uploadImage(formData: FormData): Promise<string> {
    try {
        let link="";
        // // 27|2LK5mK1sbeI0oM4pif5jO8jcL78xnv8rDoBIvx5v
        const response = await fetch('https://imgtbl.com/api/v1/images/tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 27|2LK5mK1sbeI0oM4pif5jO8jcL78xnv8rDoBIvx5v',
            },
            body: JSON.stringify({
                num: '1',
                seconds: 60*60
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if(data.status){
            data.data.tokens.some(async (token: any) => {
                const res = await fetch('https://imgtbl.com/api/v1/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer 27|2LK5mK1sbeI0oM4pif5jO8jcL78xnv8rDoBIvx5v',
                    },
                    //file	File	图片文件
                    // token	String	临时上传 Token
                    // permission	Integer	权限，1=公开，0=私有
                    // strategy_id	Integer	储存策略ID
                    // album_id	Integer	相册ID
                    // expired_at	String	图片过期时间(yyyy-MM-dd HH:mm:ss)
                    body: JSON.stringify({
                        file: formData.get('image'),
                        token: token,
                        permission: 1,
                        strategy_id: 1,
                        album_id: 1,
                        expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
                    }),
                });

                // 字段	类型	说明
                // status	Boolean	状态，true 或 false
                // message	String	描述信息
                // data	Object	数据
                // key	String	图片唯一密钥
                // name	String	图片名称
                // pathname	String	图片路径名
                // origin_name	String	图片原始名
                // size	Float	图片大小，单位 KB
                // mimetype	String	图片类型
                // extension	String	图片拓展名
                // md5	String	图片 md5 值
                // sha1	String	图片 sha1 值
                // links	Object	链接
                // url	String	图片访问 url
                // html	String	-
                // bbcode	String	-
                // markdown	String	-
                // markdown_with_link	String	-
                // thumbnail_url	String	缩略图 url
                // delete_url	String	图片删除 url

                // 获取links
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const uploadData =await res.json();
                if (uploadData.status) {
                     link = uploadData.data.links;
                } else {
                    throw new Error('上传失败');
                }
            })
        }else{
            throw new Error('获取上传token失败');
        }
        return link;
    } catch (error) {
        console.error('分享失败，需下载后发送或重试，失败原因:', error);
        throw error;
    }
}

///images
// 请求参数(Query)
//
// 字段	类型	说明
// page	Integer	页码
// order	String	排序方式，newest=最新，earliest=最早，utmost=最大，least=最小
// permission	String	权限，public=公开的，private=私有的
// album_id	Integer	相册 ID
// q	String	筛选关键字
// 返回参数
//
// 字段	类型	说明
// status	Boolean	状态，true 或 false
// message	String	描述信息
// data	Object	数据
// current_page	Integer	当前所在页页码
// last_page	Integer	最后一页页码
// per_page	Integer	每页展示数据数量
// total	Integer	图片总数量
// data	Object[]	图片列表
// key	String	图片唯一密钥
// name	String	图片名称
// origin_name	String	图片原始名称
// pathname	String	图片路径名
// size	Float	图片大小，单位 KB
// width	Integer	图片宽度
// height	Integer	图片高度
// md5	String	图片 md5 值
// sha1	String	图片 sha1 值
// human_date	String	上传时间(友好格式)
// date	String	上传日期(yyyy-MM-dd HH:mm:ss)
// links	Object	链接，与上传接口返回参数中的 links 相同
export async function fetchImages(page: number, order: string, q: string): Promise<any[]> {
    try {
        // 27|2LK5mK1sbeI0oM4pif5jO8jcL78xnv8rDoBIvx5v
        const response = await fetch('https://imgtbl.com/api/v1/images', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 27|2LK5mK1sbeI0oM4pif5jO8jcL78xnv8rDoBIvx5v',
            },
            body: JSON.stringify({
                page: page,
                order: 'newest',
                permission: 'public',
                album_id: 21,
                q: q
            })
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('获取图片列表失败，失败原因:', error);
        throw error;
    }
}