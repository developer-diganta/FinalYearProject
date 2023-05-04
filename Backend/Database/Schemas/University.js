university = {
    name: String,
    password: String,
    phone: String,
    email: String,
    contract: {
        contract_id: String,
        contract_type: String,
        contract_receipt: String,
        contract_amount: String,
        contract_status: String,
        contract_billing_details: String,
        contract_start_date: Date,
        contract_end_date: Date
    },
    isdeleted: Boolean,
    deletionTime: Date
}

module.exports = university;