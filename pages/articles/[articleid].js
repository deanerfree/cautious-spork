import { getData } from "../../helper"
import Loading from "../../components/Loading/Loading"
import { useEffect, useState, useContext } from "react"
import { Button, Typography } from "@mui/material"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { useRouter } from "next/router"
import AuthContext from "../../context/AuthContext"
import style from "./style/style.module.css"
import { CustomButton } from "../../components/CustomButton/CustomButton"

export const getStaticPaths = async () => {
	const data = await getData()
	const article = data.results.map((item) => {
		return { params: { articleid: item.slug } }
	})
	return { paths: article, fallback: false }
}

export const getStaticProps = async (context) => {
	const { params } = context
	const articleid = params.articleid

	const data = await getData()

	const article = data.results.find((item) => item.slug === articleid)

	return { props: { article } }
}

const ArticleDetails = ({ article }) => {
	const router = useRouter()
	const { currentUser } = useContext(AuthContext)
	const { title, sections } = article
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (article) {
			if (!currentUser && article.subscriberOnly === true) {
				router.push("/")
			}
			setLoading(false)
		}
	}, [currentUser, article])

	return loading === true && article !== undefined ? (
		<Loading />
	) : (
		<div className={style.container}>
			<div>
				<CustomButton
					className={style.backButton}
					onClick={() => router.replace("/")}>
					<ArrowBackIosIcon />
				</CustomButton>
			</div>
			<div className={style.articleContent}>
				<Typography variant='h4'>{title}</Typography>
				<br />
				{article.author.map((author, index) => {
					return (
						<Typography key={index} variant='subtitle1'>
							By: {author.firstName} {author.lastName}{" "}
						</Typography>
					)
				})}
				<br />
				{sections.map((section, index) => {
					return section.body ? (
						<div key={index}>
							<Typography>{section.body}</Typography>
							<br />
						</div>
					) : null
				})}
			</div>
		</div>
	)
}

export default ArticleDetails
