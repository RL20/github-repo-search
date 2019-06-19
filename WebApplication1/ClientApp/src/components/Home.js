import React, { Component } from 'react';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showBookmarks: false,
            isFirstTime: true,
            query: '',
            resultList: [],
            bookmarkList: [],
            itemList: []
        };

    }


    componentWillMount = () => {
    };

    handleSearch = (user) => {
        let url = 'https://api.github.com/users/' + user + '/repos';
        fetch(url).
            then(response => response.json()).then((repos) => {
                console.log(repos);
                console.log(repos.length);
                this.setState({
                    repos: repos
                });
            });
    };

    searchRespository = () => {
        let query = this.state.query;

        fetch("https://api.github.com/search/repositories?q=" + query).
            then(response => response.json()).then((repos) => {
                console.log(repos);
                console.log(repos.length);
                this.setState({
                    resultList: repos.items || [],
                    itemList: repos.items || [],
                    isFirstTime: false
                });
            });
    };

    handleChange = (event) => {
        this.setState({ query: event.target.value });
    }

    toggleView = () => {

        if (this.state.showBookmarks) {
            this.setState({
                itemList: this.state.resultList
            });
        } else {
            this.getBookmarks();
        }


        this.setState({ showBookmarks: !this.state.showBookmarks });
    }
    //call to backend bookmarkRepo in BookmarkController
    bookmarkRepo = (item) => {
        var data = {
            "full_name": item.full_name,
            "avatar_url": item.owner.avatar_url,
            "html_url": item.html_url
        };

        fetch('api/Bookmark/bookmarkRepo', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => {
                console.log(response);
            });
    }

    getBookmarks = () => {
        if (this.state.bookmarkList.length > 0) {
            this.setState({
                itemList: this.state.bookmarkList
            });
        } 
            fetch('api/Bookmark/getBookmarks')
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        bookmarkList: data || [],
                        itemList: data || []
                    });
            });
        

    }
    

    // Use the render function to return JSX component      
    render() {
        const resultList = this.state.itemList.map((item, index) =>
            <div className="card" key={'card' + index}>
                <img className="card-img-top" src={item.avatar_url == undefined ? item.owner.avatar_url : item.avatar_url} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title" title={item.full_name}>{item.full_name}</h5>
                    <button className="btn btn-primary" onClick={() => this.bookmarkRepo(item)}>
                        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M19 18l2 1V3c0-1.1-.9-2-2-2H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13zM15 5H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        );

        return (
            <div className="isracardProject">
                <div className="top">
                    <div style={{ display: !this.state.showBookmarks ? 'block' : 'none'}}>
                            <h1>Search Repository</h1>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Search" value={this.state.query} onChange={this.handleChange} />
                            </div>
                            <button className="btn btn-primary btn-lg active" onClick={this.searchRespository}>Go</button>
                            <button className="btn btn-primary btn-lg active" onClick={this.toggleView}>Bookmarks</button>
                        </div> :
                        <div style={{ display: this.state.showBookmarks ? 'block' : 'none' }}>
                            <button className="btn btn-primary btn-lg active" onClick={this.toggleView}>return</button>
                            <h1>Bookmarks</h1>
                        </div>
                </div>
                <div className="gallery-view">
                    {resultList.length > 0 ? resultList : this.state.isFirstTime ? '' : <p>No results</p>}
                </div>
            </div>
        );
    }
}

