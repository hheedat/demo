loginAction: function () {
    var self = this;

    //ҳ��post
    if (self.isPost()) {
        //�û���¼�ɹ�д��Session
        var name = self.post('name'); //��ȡpost�������û���
        var pwd = self.post('pwd'); //��ȡpost����������

        return D('User').where({ //�����û����������ѯ��������������
            name: name,
            pwd: md5(pwd)
        }).find().then(function (data) {
            if (isEmpty(data)) {
                //�û����������벻��ȷ�����ش�����Ϣ
                return self.error(403, '�û����������벻��ȷ');
            } else {
                return self.session('userInfo', data);
            }
        }).then(function () {
            //��¼�ɹ���ת
            return self.redirect('index');
        });
    } else {
        //ҳ�����
        self.assign({'title': '����-��¼'});
        return self.display();
    }
}