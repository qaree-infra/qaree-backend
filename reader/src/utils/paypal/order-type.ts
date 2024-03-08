export type Order = {
	create_time?: string;
	update_time?: string;
	id: string;
	processing_instruction?: string;
	purchase_units?: Array<PurchaseUnit>;
	payment_source: Array<PaymentSource>;
	links: Array<Link>;
	intent?: string;
	payer?: Payer;
	status: string;
};

export type CreatedOrder = {
	create_time?: string;
	update_time?: string;
	id: string;
	processing_instruction?: string;
	purchase_units?: Array<PurchaseUnit>;
	payment_source: Array<PaymentSource>;
	links: Array<Link>;
	intent?: string;
	payer?: Payer;
	status: string;
};

export type CapturedOrder = {
	create_time?: string;
	update_time?: string;
	id: string;
	processing_instruction?: string;
	purchase_units: Array<PurchaseUnit>;
	payment_source: Array<PaymentSource>;
	links: Array<Link>;
	intent: string;
	payer: Payer;
	status: string;
};

type PaymentSource = {
	card: Card | null;
	bancontact: Bancontact | null;
	blik: Blik | null;
	eps: Eps | null;
	giropay: Giropay | null;
	ideal: Ideal | null;
	mybank: Mybank | null;
	p24: P24 | null;
	sofort: SoFort | null;
	trustly: Trustly | null;
	venmo: Venmo | null;
	paypal: PayPal | null;
};

type Card = {
	name: string;
	last_digits: string;
	available_networks: Array<string>;
	type: string;
	from_request: FromRequest;
	brand: string;
	authentication_result: AuthenticationResult;
	attributes: Attributes;
	expiry: string;
	bin_details: BinDetails;
};

type FromRequest = {
	last_digits: string;
	expiry: string;
};

type AuthenticationResult = {
	liability_shift: string;
	three_d_secure: ThreeDSecure;
};

type ThreeDSecure = {
	authentication_status: string;
	enrollment_status: string;
};

type Attributes = {
	vault: Vault;
};

type Vault = {
	id: string;
	status: string;
	links: Array<Link>;
	customer: Customer;
};

type Customer = {
	id: string;
};

type BinDetails = {
	bin: string;
	issuing_bank: string;
	products: Array<string>;
	bin_country_code: string;
};

type Bancontact = {
	card_last_digits: string;
	name: string;
	country_code: string;
	bic: string;
	iban_last_chars: string;
};

type Blik = {
	name: string;
	country_code: string;
	email: string;
	one_click: OneClick;
};

type OneClick = {
	consumer_reference: string;
};

type Eps = {
	name: string;
	country_code: string;
	bic: string;
};

type Giropay = {
	name: string;
	country_code: string;
	bic: string;
};

type Ideal = {
	name: string;
	country_code: string;
	bic: string;
	iban_last_chars: string;
};

type Mybank = {
	name: string;
	country_code: string;
	bic: string;
	iban_last_chars: string;
};

type P24 = {
	payment_descriptor: string;
	method_id: string;
	method_description: string;
	name: string;
	email: string;
	country_code: string;
};

type SoFort = {
	name: string;
	country_code: string;
	bic: string;
	iban_last_chars: string;
};

type Trustly = {
	name: string;
	country_code: string;
	bic: string;
	iban_last_chars: string;
};

type Venmo = {
	user_name: string;
	attributes: Attributes;
	email_address: string;
	account_id: string;
	name: Name;
	phone_number: PhoneNumber;
	address: Address;
};

type PayPal = {
	account_status: string;
	phone_type: string;
	attributes: Attributes;
	email_address: string;
	account_id: string;
	name: Name;
	phone_number: PhoneNumber;
	birth_date: string;
	tax_info: TaxInfo;
	address: Address;
};

type PurchaseUnit = {
	reference_id: string;
	description: string;
	custom_id: string;
	invoice_id: string;
	id: string;
	soft_descriptor: string;
	items: Array<Item>;
	amount: Amount;
	payee: Payee;
	payment_instruction: PaymentInstruction;
	shipping: Shipping;
	supplementary_data: SupplementaryData;
	payments: Payments;
};

type Item = {
	name: string;
	quantity: string;
	description: string;
	sku: string;
	url: string;
	category: string;
	image_url: string;
	unit_amount: UnitAmount;
	tax: UnitAmount;
	upc: Upc;
};

type UnitAmount = {
	currency_code: string;
	value: string;
};

type Upc = {
	type: string;
	code: string;
};

type Amount = {
	currency_code: string;
	value: string;
	breakdown: Breakdown;
};

type Breakdown = {
	item_total: UnitAmount;
	shipping: UnitAmount;
	handling: UnitAmount;
	tax_total: UnitAmount;
	insurance: UnitAmount;
	shipping_discount: UnitAmount;
	discount: UnitAmount;
};

type Payee = {
	email_address: string;
	merchant_id: string;
};

type PaymentInstruction = {
	platform_fees: Array<PlatformFee>;
	payee_pricing_tier_id: string;
	payee_receivable_fx_rate_id: string;
	disbursement_mode: string;
};

type PlatformFee = {
	amount: UnitAmount;
	payee: Payee;
};

type Shipping = {
	type: string;
	options: Array<ShippingOption>;
	name: Name;
	address: Address;
	trackers: Array<Tracker>;
};

type ShippingOption = {
	id: string;
	label: string;
	selected: boolean;
	type: string;
	amount: UnitAmount;
};

type Name = {
	given_name: string;
	surname: string;
};

type Address = {
	address_line_1: string;
	address_line_2: string;
	admin_area_2: string;
	admin_area_1: string;
	postal_code: string;
	country_code: string;
};

type Tracker = {
	id: string;
	status: string;
	items: Array<{
		name: string;
		quantity: string;
		sku: string;
		url: string;
		image_url: string;
		upc: string;
	}>;
	links: Array<{
		href: string;
		rel: string;
		method: string;
	}>;
	create_time: string;
	update_time: string;
};

type Payments = {
	authorizations: Array<Authorization>;
	captures: Array<Capture>;
	refunds: Array<Refund>;
};

type Authorization = {
	status: string;
	status_details: StatusDetails;
	id: string;
	invoice_id: string;
	custom_id: string;
	links: Array<Link>;
	amount: Amount;
	network_transaction_reference: NetworkTransactionReference;
	seller_protection: SellerProtection;
	expiration_time: string;
	create_time: string;
	update_time: string;
	processor_response: ProcessorResponse;
};

type StatusDetails = {
	reason: string;
};

type NetworkTransactionReference = {
	id: string;
	date: string;
	acquirer_reference_number: string;
	network: string;
};

type SellerProtection = {
	status: string;
	dispute_categories: Array<string>;
};

type ProcessorResponse = {
	avs_code: string;
	cvv_code: string;
	response_code: string;
	payment_advice_code: string;
};

type Capture = {
	status: string;
	status_details: StatusDetails;
	id: string;
	invoice_id: string;
	custom_id: string;
	final_capture: boolean;
	disbursement_mode: string;
	links: Array<Link>;
	amount: Amount;
	network_transaction_reference: NetworkTransactionReference;
	seller_protection: SellerProtection;
	seller_receivable_breakdown: SellerReceivableBreakdown;
	processor_response: ProcessorResponse;
	create_time: string;
	update_time: string;
};

type SellerReceivableBreakdown = {
	platform_fees: Array<PlatformFee>;
	gross_amount: Amount;
	paypal_fee: Amount;
	paypal_fee_in_receivable_currency: Amount;
	net_amount: Amount;
	receivable_amount: Amount;
	exchange_rate: ExchangeRate;
};

type ExchangeRate = {
	value: string;
	source_currency: string;
	target_currency: string;
};

type Refund = {
	status: string;
	status_details: StatusDetails;
	id: string;
	invoice_id: string;
	custom_id: string;
	acquirer_reference_number: string;
	note_to_payer: string;
	seller_payable_breakdown: SellerPayableBreakdown;
	links: Array<Link>;
	amount: Amount;
	payer: Payer;
	create_time: string;
	update_time: string;
};

type SellerPayableBreakdown = {
	platform_fees: Array<PlatformFee>;
	net_amount_breakdown: Array<NetAmountBreakdown>;
	gross_amount: Amount;
	paypal_fee: Amount;
	paypal_fee_in_receivable_currency: Amount;
	net_amount: Amount;
	net_amount_in_receivable_currency: Amount;
	total_refunded_amount: Amount;
};

type NetAmountBreakdown = {
	refunded_amount: Amount;
	original_amount: Amount;
};

type Payer = {
	email_address: string;
	payer_id: string;
	name: Name;
	phone: Phone;
	birth_date: string;
	tax_info: TaxInfo;
	address: Address;
};

type Phone = {
	phone_type: string;
	phone_number: PhoneNumber;
};

type PhoneNumber = {
	national_number: string;
};

type TaxInfo = {
	tax_id: string;
	tax_id_type: string;
};

type Link = {
	href: string;
	rel: string;
	method: string;
};

type SupplementaryData = {
	card: CardLevels;
};

type CardLevels = {
	level_2: Level2;
	level_3: Level3;
};

type Level2 = {
	invoice_id: string;
	tax_total: Amount;
};

type Level3 = {
	ships_from_postal_code: string;
	line_items: Array<LineItem>;
	shipping_amount: Amount;
	duty_amount: Amount;
	discount_amount: Amount;
	shipping_address: Address;
};

type LineItem = {
	name: string;
	quantity: string;
	description: string;
	sku: string;
	url: string;
	category: string;
	image_url: string;
	unit_amount: Amount;
	tax: Amount;
	upc: Upc;
	commodity_code: string;
	unit_of_measure: string;
	discount_amount: Amount;
	total_amount: Amount;
};
