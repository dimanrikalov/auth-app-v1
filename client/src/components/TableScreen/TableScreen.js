import { useEffect, useReducer, useState } from 'react';
import ENDPOINTS from '../../endpoints';
import styles from './TableScreen.module.css';

const initialState = {
	code: '',
	email: '',
	password: '',
	agree: false,
	date: '',
	status: '',
};

function reducer(state, action) {
	switch (action.type) {
		case 'SET_FIELD':
			return {
				...state,
				[action.field]: action.value,
			};
		case 'RESET_FIELDS':
			return initialState;
		default:
			return state;
	}
}

export const TableScreen = () => {
	const [data, setData] = useState(null);
	const [editingEntry, setEditingEntry] = useState(null);
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		fetch(ENDPOINTS.LOGIN_HISTORY)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
			});
	}, []);

	const keygen = (data, i) => {
		return `${data.email}${data.password}${data.date}${data.status}${data.agree}${data.code}${i}`;
	};

	const handleDelete = (entry) => {
		// Perform delete request to the server using the code
		fetch(ENDPOINTS.LOGIN_HISTORY, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...entry,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setData(data);
			});
	};

	const handleEdit = (entry) => {
		setEditingEntry(entry);
		dispatch({ type: 'RESET_FIELDS' });
		dispatch({ type: 'SET_FIELD', field: 'date', value: entry.date });
		dispatch({ type: 'SET_FIELD', field: 'status', value: entry.status });
	};

	const handleConfirm = (entry, state) => {
		setEditingEntry(null);
		dispatch({ type: 'RESET_FIELDS' });
		fetch(ENDPOINTS.LOGIN_HISTORY, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				before: entry,
				after: state,
			}),
		})
			.then((res) => res.json())
			.then((data) => setData(data));
	};

	const handleFieldChange = (field, value) => {
		dispatch({ type: 'SET_FIELD', field, value });
	};

	return (
		<>
			{data && data.length > 0 ? (
				<>
					<h1>Login history:</h1>
					<table id="dataTable" className={styles.table}>
						<thead>
							<tr>
								<th>Code</th>
								<th>Email</th>
								<th>Password</th>
								<th>Agree</th>
								<th>Date</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{data.map((entry, i) => (
								<tr key={keygen(entry, i)}>
									{editingEntry === entry ? (
										<>
											<td>
												<input
													type="text"
													value={state.code}
													onChange={(e) =>
														handleFieldChange(
															'code',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.email}
													onChange={(e) =>
														handleFieldChange(
															'email',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.password}
													onChange={(e) =>
														handleFieldChange(
															'password',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="checkbox"
													checked={state.agree}
													onChange={(e) =>
														handleFieldChange(
															'agree',
															e.target.checked
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.date}
													onChange={(e) =>
														handleFieldChange(
															'date',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.status}
													onChange={(e) =>
														handleFieldChange(
															'status',
															e.target.value
														)
													}
												/>
											</td>
											<td className={styles.buttonsTd}>
												<button
													onClick={() =>
														handleConfirm(
															entry,
															state
														)
													}
												>
													Confirm
												</button>
											</td>
										</>
									) : (
										<>
											<td>{entry.code || 'No code'}</td>
											<td>{entry.email}</td>
											<td>{entry.password}</td>
											<td>{entry.agree.toString()}</td>
											<td>{entry.date}</td>
											<td>{entry.status}</td>
											<td className={styles.buttonsTd}>
												<button
													onClick={() =>
														handleEdit(entry)
													}
												>
													Edit
												</button>
												<button
													onClick={() =>
														handleDelete(entry)
													}
												>
													Delete
												</button>
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</>
			) : (
				<h1>No recent login records to display!</h1>
			)}
		</>
	);
};
