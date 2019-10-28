import React, { Fragment, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

import "../styles/react-draft-wysiwyg.css";

function Home() {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	function onEditorStateChange(editorContent) {
		setEditorState(editorContent);
		console.log(editorState);
	}

	const toRaw = editorState => convertToRaw(editorState.getCurrentContent());

	const getHtmlFromRaw = raw => draftToHtml(raw);

	function displayHTML() {
		const raw = toRaw(editorState);
		const HTML = getHtmlFromRaw(raw);

		return alert(HTML);
	}

	return (
		<Fragment>
			<Editor
				editorState={editorState}
				onEditorStateChange={onEditorStateChange}
			/>
			<button onClick={displayHTML}>Show HTML</button>
		</Fragment>
	);
}

export default Home;
