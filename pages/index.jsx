import React, { Fragment, useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import axios from "axios";

import baseUrl from "../utils/baseUrl";

import "draft-js/dist/Draft.css";

function Home() {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [blockName, setBlockName] = useState("");
	const [contentFromDB, setContentFromDB] = useState("");
	const [editorRenderState, setEditorRenderState] = useState(false);

	useEffect(() => {
		setEditorRenderState(true);
	}, []);

	function _onEditorStateChange(editorContent) {
		setEditorState(editorContent);
		console.log(editorState);
	}

	const _toRaw = editorState => convertToRaw(editorState.getCurrentContent());

	const _getHtmlFromRaw = raw => draftToHtml(raw);

	function _handleChange(event) {
		setBlockName(event.target.value);
	}

	async function _postRawContent(event) {
		event.preventDefault();
		const url = `${baseUrl}/api/content`;
		const data = _toRaw(editorState);
		const payload = { params: { name: blockName }};

		try {
			await axios.post(url, data, payload);
		} catch (error) {
			console.error(error);
		}
	}

	async function _getRawContent(event) {
		event.preventDefault();
		const url = `${baseUrl}/api/content`;
		const payload = { params: { name: blockName }};

		try {
			const response = await axios.get(url, payload);
			const blocks = response.data[0].block;
			const HTML = _getHtmlFromRaw(blocks);
			setContentFromDB(HTML);
		} catch (error) {
			console.error(error);
		}
	}

	function createMarkup() {
		return {__html: `${contentFromDB}`};
	}


	function handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return "handled";
		}
		return "not-handled";
	}

	function _onBoldClick() {
		_onEditorStateChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
	}

	return (
		<Fragment>
			{editorRenderState ?
				<Fragment>
					<button onClick={_onBoldClick}>Bold</button>
					<Editor
						editorState={editorState}
						handleKeyCommand={handleKeyCommand}
						onChange={_onEditorStateChange}
					/>
				</Fragment> : null}
			<div style={{ margin: "20px", border: "1px solid red"}}>
				<h2>POST</h2>
				<form onSubmit={_postRawContent} style={{ margin: "20px" }}>
					<label htmlFor="blockName">Block name:</label>
					<input onChange={_handleChange} name="blockName" placeholder='Block Name' required />
					<button style={{ display: "block" }} type='submit'>Submit</button>
				</form>
			</div>
			<div style={{ margin: "20px", border: "1px solid green"}}>
				<h2>GET</h2>
				<form onSubmit={_getRawContent} style={{ margin: "20px" }}>
					<label htmlFor="blockName">Block name:</label>
					<input onChange={_handleChange} name="blockName" placeholder='Block Name' required />
					<button style={{ display: "block" }} type='submit'>Submit</button>
				</form>
			</div>

			<div style={{ margin: "20px", border: "1px solid green"}}>
				<h2>INJECTED HTML</h2>
				{contentFromDB ? <div dangerouslySetInnerHTML={createMarkup()} /> : <div style={{ height: "200px", backgroundColor: "grey"}}/>}
			</div>

			<div style={{ margin: "20px", border: "1px solid green"}}>
				<h2>HTML structure</h2>
				{contentFromDB ? <div>{contentFromDB}</div>: <div style={{ height: "200px", backgroundColor: "grey" }}/>}
			</div>

		</Fragment>
	);
}

export default Home;
