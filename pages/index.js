import React, { Fragment, useState } from "react";
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

import "../styles/react-draft-wysiwyg.css";

function Home() {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	function onEditorStateChange(editorContent) {
		setEditorState(editorContent);
		console.log(editorState.toJS());
	}

	return (
		<Fragment>
			<Editor
				editorState={editorState}
				onEditorStateChange={editorContent =>
					onEditorStateChange(editorContent)
				}
			/>
		</Fragment>
	);
}

export default Home;
