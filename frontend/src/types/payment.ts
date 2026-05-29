export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface PaymentOrderResponse {
  payment_id: number
  order_id: string
  amount: number
  currency: string
  key_id: string
  email: string
  name?: string | null
  description?: string | null
}

export interface PaymentRecord {
  id: number
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  email: string
  name: string | null
  description: string | null
  created_at: string
}

export interface DonationOrderResponse {
  donation_id: number
  order_id: string
  amount_paise: number
  currency: string
  key_id: string
  category: string
}

export interface RazorpaySuccessPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
