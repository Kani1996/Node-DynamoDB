var express = require('express');
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const config = require('../config/config.js');
var router = express.Router();
AWS.config.update(config.aws_remote_config);
const docClient = new AWS.DynamoDB.DocumentClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const params = {
    TableName: config.aws_table_name
  };
  docClient.scan(params, function(err, data) {
    if (err) {
      res.send({
        success: false,
        message: err
      });
    } else {
      const { Items } = data;
      res.send({
        success: true,
        message: 'Loaded User details',
        UserDetails: Items
      });
    }
  });
}); 

router.post('/add-user',function(req,res,next){
  const Item={...req.body};
  Item.id = uuidv1();
  const params = {
    TableName: config.aws_table_name,
    Item: Item
  };
     // Call DynamoDB to add the item to the table
     docClient.put(params, function (err, data) {
      if (err) {
          res.send({
              success: false,
              message: err
          });
      } else {
          res.send({
              success: true,
              message: 'Added User Details',
              UserDetails: data
          });
      }
    });
});

router.delete('/delete-user',function(req,res,next){
    const name = req.query.name;
    const params = {
      TableName: config.aws_table_name,
      Key:{
          Username : name,
          Mobilenumber : req.query.number
        }
    };
    docClient.delete(params,function(err,data){
        if(err){
          res.send({
             success : false,
             message : err
          });
        }else{
          res.send({
            success : true,
            message : 'Userdetails deleted successfully',
            UserDetails : data
          })
        }
    });
});

module.exports = router;
