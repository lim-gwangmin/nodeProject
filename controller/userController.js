const { Datas, EveryWorks, TargetWorks } = require("../models/Users.js");
const schedule = require('node-schedule');
const FCM = require('fcm-node');
const serverKey = 'AAAAgggD64o:APA91bHsscrzZne4hjPcShWZTvv_u-m-U5r4fxwY7JsOE-OT877YLi6bGYWdmyA2ZeY6L1VxbpY6CucpSuKiO4PZv_mLb4TNC30yCdclKmzW0HcawNtvTwCQxGDdBWax-Lv6ZF8R65ZK';
const fcm = new FCM(serverKey);

const message = {
   to: '/topics/all',
   priority: 'high',
   notification: {
     title: '웹 푸시 테스트 제목',
     body: '웹 푸시 테스트 내용',
   },
 };

const pushMessage = fcm.send(message, (err, response) => {

   if (err) {
      console.log(`Error: ${err}`);
   } else {
      console.log(`Response: ${response}`);
   }
});
// 다음 당번 순번 값
const nextTargetSeq = async target => {
   const totalCount = await Datas.countDocuments({});
   const targetSeq = totalCount < target.otherList + 1 ? 1 : target.otherList + 1;

   return targetSeq;
}


// 주 마다 월요일 09:00 AM에 함수를 호출
const weeklyTarget = schedule.scheduleJob({ dayOfWeek: 1, hour: 00, minute: 00 }, async () => {
   try {
      // Datas 모델의 문서 수를 세는 메서드
      const prevData = await Datas.findOne({ target: true });
      
      if (prevData) {
        // 데이터를 찾았을 때
        prevData.target = !prevData.target;
        await prevData.save();
        console.log('이전 데이터가 성공적으로 업데이트되었습니다.');
      }
  
      const targetSeq = await nextTargetSeq(prevData);
      const nextData = await Datas.findOne({ otherList: targetSeq });
 
      pushMessage();

      if (nextData) {
        // 데이터를 찾았을 때
        nextData.target = !nextData.target;
        await nextData.save();
        console.log('다음 데이터가 성공적으로 업데이트되었습니다.');
      } else {
        console.log('해당 데이터를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('오류 발생:', err);
    }
});



exports.getAllUsers = async (req, res) => {
   const target = await Datas.findOne({target: true});
   const targetSeq =  await nextTargetSeq(target);
   const nextTarget = await Datas.findOne({seq: targetSeq});
   const userList = await Datas.find({});
   const everyWorks = await EveryWorks.find({});
   const targetWorks = await TargetWorks.find({});

   res.render("index", {
      target,
      nextTarget,
      userList,
      everyWorks,
      targetWorks
  });

};