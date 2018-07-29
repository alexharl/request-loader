# Example

```
  Install dependencies
> yarn
  
  compile source files
> tsc

  run example
> node .\example.js
```

# Overview

## Basic Use
The basic use of **`RequestLoader`** is to fetch json data from an url.

To use this functionality, you can simply use the `static function exec` :

```
const result = await RequestLoader.exec('https://randomuser.me/api/').catch(error => {
    console.error('fetching json failed.', e);
    return null;
});
```
You can also instantiate **`RequestLoader`** by simply passing the endpoints uri as a parameter :
```
const rl = new RequestLoader('https://randomuser.me/api/');
const result = rl.loadData();
```

**Q**: Why is `exec` not used here ?  
**A**: `exec` is only feasable if you do not want to parse your data after loading. See `Using Strategies`.


## Using Strategies
Instantiation of **`RequestLoader`** with an url results in its strategy being a default strategy. The default strategy simply returns its result as json.  
Alternatively you can use a custom strategy to conrol the parsing and transformation of the result data.

The basic methods of **`RequestLoaderStrategy`** are 
#### transform
```
transform(body:any): any;
```

This method gets called after a response was received. You can use this for example to parse HTML with `cheerio`. This is used in the **`CheerioStrategy`**.

```
transform(body) {
    return cheerio.load(body);
}
```

#### parse
```
parse(data:any): any;
```
After the body was prepared in `transform`, the transformed data gets passed to the `parse` method. The parse method may for example iterate over elements inside data and return an array of newly created objects representing the data in `data`.

# API
## RequestLoader
```
constructor(uri: string);
constructor(strategy: RequestLoaderStrategy);
```
Instantiate a **`RequestLoader`** either with a uri or a **`RequestLoaderStrategy`**. When instatiation with a url-string the **`RequestLoaderBaseStrategy`** is used, wich returns json.

```
public static async exec(uri: string);
public static async exec(strategy: RequestLoaderStrategy);
```
Static `exec` is mostly only used by instance member function `exec` of **`RequestLoader`** to load data. You can also call this method either if you already got a RequestStrategy instance or just want to use the default strategy. In this case, just pass a uri.
```
public async exec();
```
Call `exec` to start the request.