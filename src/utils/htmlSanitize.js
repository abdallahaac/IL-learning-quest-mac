// small, safe sanitizer for our editor HTML
export const looksLikeHtml = (s) =>
	typeof s === "string" && /<\/?[a-z][\s\S]*>/i.test(s);

export const sanitizeBasic = (html = "") => {
	try {
		const wrapper = document.createElement("div");
		wrapper.innerHTML = html;
		wrapper
			.querySelectorAll("script, iframe, object, embed, style, link")
			.forEach((n) => n.remove());
		wrapper.querySelectorAll("*").forEach((el) => {
			[...el.attributes].forEach((a) => {
				if (/^on/i.test(a.name)) el.removeAttribute(a.name);
			});
		});
		return wrapper.innerHTML;
	} catch {
		return html;
	}
};
