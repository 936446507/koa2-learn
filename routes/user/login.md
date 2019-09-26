# 用户登录

## 接口类型
> POST接口

## 接口描述
> 用户登录

## 参数
参数名|类型|描述|默认值
:-:|:-:|:-:|:-:
username|string|用户名|-
password|string|密码|-

## 开发人
> Takashi

## 正确返回
```javascript
{
  error_code: 0,
  data: {
    username: 'username'
  }
}
```

## 错误返回
```javascript
{
  error_code: > 0,
  error_message: ''
}
```