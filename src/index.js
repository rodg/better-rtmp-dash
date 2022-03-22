import "regenerator-runtime/runtime";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import useSWR from "swr";
import {
	Button,
	Card,
	Dropdown,
	ButtonGroup,
	DropdownButton,
} from "react-bootstrap";

const apiUrl = "your api url";
const rtmpUrl = "your rtmp url";

const fetcher = (url) =>
	fetch(url, {
		mode: "cors",
		headers: {
			Accept: "application/json",
		},
	}).then((res) => res.json());

const imgFetcher = (url) =>
	fetch(url, { mode: "cors" }).then((res) => res.blob());

const useStreams = () => {
	const { data: streams, error } = useSWR(
		`https://${apiUrl}/streams`,
		fetcher
	);

	return { streams: streams ?? [], error: error, isLoading: !!streams };
};

const useThumbnail = (stream) => {
	const [img, setImg] = useState();
	const isLive = !!stream.live_stream;

	const { data: image, error } = useSWR(
		isLive
			? `https://${stream.live_stream.region}.${rtmpUrl}/thumbnails/${stream.name}.png`
			: null,
		imgFetcher
	);

	useEffect(() => {
		if (image) {
			const imageObjectURL = URL.createObjectURL(image);
			setImg(imageObjectURL);
		} else if (isLive) {
			setImg("./loading_320x240.png");
		} else {
			setImg("./dummy_320x240.png");
		}
	}, [stream, image]);
	return { image: img, isLive: isLive };
};

const CopyButton = ({ stream, ...props }) => {
	const [variant, setVariant] = useState("primary");
	const [text, setText] = useState();
	return (
		<Button
			style={{ width: "10em", ...props.style }}
			variant={variant}
			onClick={() => {
				if (props.isActive) navigator.clipboard.writeText(props.text);
				setVariant("success");
				setText("Copied");
				setTimeout(() => {
					setVariant("primary");
					setText(null);
				}, 3000);
			}}
		>
			{text ?? props.children}
		</Button>
	);
};

const CopyStreamInfo = ({ stream, ...props }) => {
	const copyFunc = (region) => {
		const infoString = `Stream url: \`rtmp://${region}.${rtmpUrl}/live/\` \nStream key: \`${stream.name}?streamkey=${stream.stream_key}\``;
		navigator.clipboard.writeText(infoString);
	};
	return (
		<DropdownButton
			variant="primary"
			title="Copy Stream Info"
			style={{ width: "10em", ...props.style }}
		>
			<Dropdown.Item
				onClick={() => {
					copyFunc("us");
				}}
			>
				US
			</Dropdown.Item>
			<Dropdown.Item
				onClick={() => {
					copyFunc("eu");
				}}
			>
				EU
			</Dropdown.Item>
			<Dropdown.Item
				onClick={() => {
					copyFunc("sg");
				}}
			>
				SG
			</Dropdown.Item>
		</DropdownButton>
	);
};

const StreamInfo = ({ stream, ...props }) => {
	const { image, isLive } = useThumbnail(stream);
	const [watchLink, setWatchLink] = useState();

	const streamUrl = `rtmp://`;

	useEffect(() => {
		if (isLive)
			setWatchLink(
				`https://${stream.live_stream.region}.${rtmpUrl}/?watch=${stream.name}`
			);
	}, [stream]);

	console.log(stream);
	return (
		<>
			<Card style={{ width: "18rem" }}>
				<Card.Img variant="left" src={image} />
				<Card.Body>
					<Card.Title>Stream Name: {stream.name}</Card.Title>
					<Card.Text>Stream Key: {stream.stream_key}</Card.Text>
					<ButtonGroup vertical>
						<CopyButton
							stream={stream}
							isActive={isLive}
							text={watchLink}
						>
							Watch Link
						</CopyButton>
						<CopyButton
							stream={stream}
							isActive={true}
							text={stream.stream_key}
						>
							Copy Stream URL
						</CopyButton>
						<CopyStreamInfo stream={stream}>
							Drop Down
						</CopyStreamInfo>
					</ButtonGroup>
				</Card.Body>
			</Card>
		</>
	);
};

// This component will re-render when the timer's replicant value changes
const App = () => {
	const { streams, isLoading } = useStreams();

	return (
		<>
			<div>
				<h1>Streams</h1>
			</div>
			<div>
				{streams.map((stream) => {
					return <StreamInfo stream={stream}></StreamInfo>;
				})}
			</div>
		</>
	);
};

const root = document.getElementById("app");
ReactDOM.render(
	<>
		<script
			src="https://unpkg.com/react/umd/react.production.min.js"
			crossOrigin="true"
		></script>

		<script
			src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
			crossOrigin="true"
		></script>

		<script
			src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
			crossOrigin="true"
		></script>
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
			integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
			crossOrigin="anonymous"
		/>
		<App></App>
	</>,
	root
);
