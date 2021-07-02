const BlogsCard = (props) => {
    return(
        <div style={{
            marginBottom: '15px'
        }}>
            <a href={props.link} target="_blank" rel="noreferrer" style={{ color: 'black' }} >{props.title}</a>
        </div>
    )
}

export default BlogsCard