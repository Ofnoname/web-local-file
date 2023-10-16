# webLocalFile.js Library Documentation

## Introduction

When making a file and creating a link for it on the web page, the most common method is to create a URL for a Blob. However, this link will become invalid after a page refresh. To ensure the link remains valid even after a refresh, we must rely on local storage.

The `webLocalFile.js` allows you to store files in local storage and then generate a permanently valid link. Access to this link is intercepted by the Service Worker, which then returns the file content. This way, even if the page is refreshed, the link remains valid. The link appears as if the file is stored on the server side.

```javascript
import { wlf } from './webLocalFile.js';

const w = new wlf();

const file = new File(["Hello, world!"], "hello.txt", {type: "text/plain"});

const url = await w.save(file, 'hello.txt')

console.log(url) // example.com/wlf/hello.txt

/* You can open or 'fetch example.com/wlf/hello.txt' now */
```

To understand the underlying mechanism, it's recommended to review the source code. The library leverages the capabilities of IndexedDB for local storage and Service Worker for intercepting requests.

## 介绍

在 Web 页面里，当我们想要把数据转化为文件形式并为其创建链接时，最常见的方法是为 Blob 创建一个 URL。但是，这个链接在页面刷新后会失效。如果我想要创建一个永久有效的链接，我们必须依赖于本地存储。

`webLocalFile.js` 允许您将文件存储在本地存储中，然后生成一个永久有效的链接。访问此链接时，Service Worker 会拦截它，并返回文件内容。这样，即使页面刷新，链接仍然有效。这个链接看起来就像文件是存储在服务器端一样。

本工具使用 IndexedDB 进行本地存储，使用 Service Worker 来拦截请求。大部分现代浏览器都支持这两个功能。

## API Documentation

### Getting Started
#### Importing the Library
To use the webLocalFile.js library in your project, you need to import it first. Here's how you can do it:

```javascript
import { wlf } from './path_to_your_directory/webLocalFile.js';
```

#### Creating an Instance
Once you've imported the library, you can create an instance of the wlf class:

You can create as many instances as you want in one page, but all instances will share the same IndexedDB and Service Worker. 
```javascript
const fileManager = new wlf();
```

### Method: `save(file, fileName)`

Saves a file to local storage and returns a permanent link.

- **Parameters:**
    - `file`: The file to be saved.
    - `fileName` (optional): The name for the file. If not provided, a random name will be generated.

- **Returns:** A promise that resolves to a string representing the permanent link.

**Example:**
```javascript
fileManager.save(myFile, 'myFileName').then(link => {
  console.log(`Permanent link: ${link}`);
});

// or using async/await
const link = await fileManager.save(myFile, 'myFileName');
```

### Method: `delete(fileName)`

Deletes a file from local storage.

- **Parameters:**
    - `fileName`: The name of the file to be deleted.

- **Returns:** A promise that resolves when the file is deleted.

**Example:**
```javascript
fileManager.delete('myFileName').then(() => {
  console.log('File deleted successfully.');
});
```

### Method: `read(fileName)`

Reads a file from local storage.

- **Parameters:**
    - `fileName`: The name of the file to be read.

- **Returns:** A promise that resolves to the file content.

**Example:**
```javascript
fileManager.read('myFileName').then(fileContent => {
  console.log(fileContent);
});
```

### Method: `estimate()`

Estimates the storage usage and availability.

- **Returns:** A promise that resolves to an object containing usage details.

**Example:**
```javascript
fileManager.estimate().then(estimate => {
  console.log(`Used bytes: ${estimate.usage}`);
  console.log(`Total available bytes: ${estimate.quota}`);
});
```