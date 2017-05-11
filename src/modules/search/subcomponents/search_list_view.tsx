import React from 'react';
import { shortenString, timeFromNow } from 'helpers';

interface Post {
  title: string;
  description: string;
  price: number;
  created_at: string;
  condition: string;
  img_url1: string;
  img_url2: string;
  img_url3: string;
}

interface Props {
  searchResult: Post [];
}

interface State {
}

class SearchListView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public redirect(id) {
    window.location.href = `#/posts/${id}`
  }

  renderListItem(post: Post, idx: number) {
    return (
      <tr key={idx} onClick={() => this.redirect(post.id)}>
        <td>{post.title}</td>
        <td>{shortenString(post.description, 30)}</td>
        <td>${Number(post.price).toLocaleString()}</td>
        <td>{timeFromNow(post.created_at)}</td>
        <td>{post.condition}</td>
      </tr>
    )
  }

  render() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Posting Date</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          { this.props.searchResult ? this.props.searchResult.map((post,idx) => this.renderListItem(post, idx)) : null }
        </tbody>
      </table>
    )
  }
}

export { SearchListView };
