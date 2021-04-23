import { ServerURL } from "constants/serverUrl";

export async function authFetch(input: RequestInfo, init?: RequestInit) {
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.href = "/";
		return null;
	}

	if (!init) init = {};
	if (!init.headers) init.headers = {};

	init.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
	return fetch(ServerURL + input, init);
}

export async function verifyToken() {
	const res = await authFetch("auth/verify");
	if (res && res.ok) {
		return true;
	}

	return false;
}
