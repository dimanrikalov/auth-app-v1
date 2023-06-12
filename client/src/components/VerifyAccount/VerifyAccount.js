import React, { useState } from 'react';
import OTPInput from 'otp-input-react';
import styles from './VerifyAccount.module.css';
import ENDPOINTS from '../../endpoints';
import { useNavigate } from 'react-router-dom';

export function VerifyAccount() {
	const navigate = useNavigate();
	const [OTP, setOTP] = useState('');
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		fetch(ENDPOINTS.VERIFY, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				code: OTP,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setError(null);
					localStorage.clear();
					localStorage.setItem('id', data);
					navigate('/user');
				} else {
					setError('Invalid code! Please try again!');
				}
			});
	};

	return (
		<div className={styles.container}>
			<h1>We sent you a code. Please type it in the field below.</h1>
			{error && <h3 className={styles.error}>{error}</h3>}
			<OTPInput
				style={{ display: 'flex', justifyContent: 'space-between' }}
				inputStyles={{
					width: 42,
					height: 64,
					padding: 0,
					fontSize: 28,
					margin: 0,
					color: 'black',
					backgroundColor: '#dcdcdc',
				}}
				value={OTP}
				onChange={setOTP}
				autoFocus
				OTPLength={6}
				otpType="number"
				disabled={false}
			/>
			<div>
				<button className={styles.submitBtn} onClick={handleSubmit}>
					Confirm
				</button>
			</div>
		</div>
	);
}
