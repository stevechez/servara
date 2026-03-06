// app/lib/actions/customers.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCustomer(formData: FormData) {
	// FIX: Add 'await' right here 👇
	const supabase = await createClient();

	const rawData = {
		name: formData.get('name'),
		phone: formData.get('phone'),
		email: formData.get('email'),
		address: formData.get('address'),
		company_id: formData.get('company_id'),
	};

	const { data, error } = await supabase
		.from('customers')
		.insert([rawData])
		.select();

	if (error) throw new Error(error.message);

	revalidatePath('/customers');
	return data;
}
