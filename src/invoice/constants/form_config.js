export const formConfig = [
    {
        label_name: '纳税人识别号',
        key: 'tax_num',
        require_rules: true,
        rules: '纳税人识别号不能为空'
    },
    {
        label_name: '开票地址',
        key: 'invoice_title_address',
        require_rules: false,
        rules: ''
    }, {
        label_name: '开户银行',
        key: 'bank_agency',
        require_rules: false,
        rules: ''
    }, {
        label_name: '银行账号',
        key: 'bank_account_number',
        require_rules: false,
        rules: ''
    }, {
        label_name: '座机',
        key: 'phone',
        require_rules: false,
        rules: ''
    }, {
        label_name: '发票收件人',
        key: 'addressee',
        require_rules: true,
        rules: '发票收件人项不能为空'
    }, {
        label_name: '收件人地址',
        key: 'addressee_address',
        require_rules: true,
        rules: '收件人地址项不能为空'
    }, {
        label_name: '收件人电话',
        key: 'addressee_phone',
        require_rules: true,
        rules: '收件人电话项不能为空'
    }, {
        label_name: '邮编',
        key: 'postcode',
        require_rules: false,
        rules: '请输入邮编号码'
    }
]

export const formConfigTextarea = [
    {
        label_name: '发票备注',
        key: 'invoice_comment',
        require_rules: false,
        rules: '',
        placeholder: '填写内容将打印在发票上'
    }, {
        label_name: '备注',
        key: 'comment',
        require_rules: false,
        rules: '',
        placeholder: '开票的时候如有需要财务注意的事项，请在此处填写备注说明'
    }
]