university = {
    name: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    phone: String,
    email: String,
    point_of_contact: {
        name: String,
        phone: String,
        email: String,
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String
        },
    },
    contract: {
        contract_id: String,
        contract_name: String,
        contract_type: String,
        contract_start_date: Date,
        contract_end_date: Date,
        contract_status: String,
        contract_status_date: Date,
        contract_amount: Number,
        contract_amount_paid: Number,
        contract_amount_due: Number,
        contract_amount_due_date: Date,
        contract_amount_due_status: String,
        contract_link: String,
        contract_notes: String,
    },
}