const express = require('express');
const multer = require('multer');

const app = express();
const port = 3000;
const upload = multer();

app.use(express.json({ extended: false }));
app.use(express.static('./view'));
app.set('view engine', 'ejs');
app.set('views', './view');

//config AWS_SERVICES
const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId: 'AKIA2ENEJLL6FKM3XCGV',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
});
AWS.config = config;
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'sanpham';


//get data from
//khai báo một api có phương thức là get gọi đến đường dẫn /
  //tạo params dùng để query dữ liệu từ tableName
    //sử dụng api do aws cung cấp là scan dùng để dọc tất cả data từ tableName
    //truyền vào một callback 2 tham số err và data
    // nếu lỗi thì trả ra 1 câu thông báo + lỗi gì
    //thành công sẽ nhận 1 mảng data từ Items dùng để render data qua trang index


app.get('/',(req,res)=>{
    const params ={
        TableName: tableName,
    };
    docClient.scan(params,(err,data)=>{
        if(err){
            return res.send('internal error'+err);
        }else{
            return res.render('index',{data:data.Items});
        }
    });
});


// xoa
// 
app.post('/delete',upload.fields([]),(req,res)=>{
const {sp_id}=req.body;
const params={
    TableName:tableName,
    Key:{
        sp_id,
    },
};
docClient.delete(params,(err,data)=>{
    if(err){
        return res.send('server error'+err);
    }else{
        return res.redirect('/');
    }
});
});


app.get('/view/save',(req,res)=>{
    return res.render('save.ejs');
});

app.post('/save',upload.fields([]),(req,res)=>{
    const {sp_id,ten_sp,don_gia,so_luong}= req.body;
    const params={
        TableName: tableName,
        Item:{
            sp_id: sp_id,
            ten_sp: ten_sp,
            don_gia: don_gia,
            so_luong: so_luong,
        }
    };
    docClient.put(params,(err,data)=>{
        if(err){
            return res.send('server error'+err);
        }else{
            return res.redirect('/');
        }
    })

});

// action listening event
app.listen(port, () => {
    console.log('listening on port', port);
});
