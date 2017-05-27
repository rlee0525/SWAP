import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import { IState, _defaultState } from './typings';
import { ImageDropzone, RadioButtons } from './subcomponents';
import {
  borderStyle,
  noBorder,
  labelStyle,
  widthFull,
  paddingLeft,
  morePadding,
  paddingBottom,
  paddingAll } from './styles';

declare var $;
const CLOUDINARY_UPLOAD_PRESET = 'xmfenamw';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dkympkwdz/upload';

class PostForm extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.updateState = this.updateState.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.radioButtonsUpdate = this.radioButtonsUpdate.bind(this);
    this.fetchAllCourses = this.fetchAllCourses.bind(this);
    this.initializeDropzone = this.initializeDropzone.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.autoComplete = this.autoComplete.bind(this);
    this.checkKey = this.checkKey.bind(this);

    this.state = {
      ..._defaultState
    }

    if (props.params.id) {
      this.fetchPost(props.params.id)
    }
  }

  public checkKey(e) {
    let keyCode = (e.keyCode ? e.keyCode : e.which);
    let metaKey = e.metaKey;
    let ctrlKey = e.ctrlKey;

    if ((keyCode > 47 && keyCode < 58) || (keyCode > 34 && keyCode < 41) || (keyCode > 95 && keyCode < 106) ||
        (keyCode == 224) || (keyCode == 17) || (keyCode == 91) || (keyCode == 93) || (keyCode == 20) ||
        (keyCode == 8) || (keyCode == 9) || (keyCode == 13) || (keyCode == 46) || ((keyCode == 65 || keyCode == 86 || keyCode == 67) && (ctrlKey === true || metaKey === true)) || (ctrlKey === true))
        {
          $('#fixed-price').removeClass("has-error");
        } else {
          e.preventDefault();
          $('#fixed-price').addClass("has-error");
          setTimeout(() => $('#fixed-price').removeClass("has-error"), 1500);
        }
  }

  public autoComplete() {
    let that = this;
    let input = function () { return  { search: $('#course').val() }};
    $('#course').devbridgeAutocomplete({
      lookup: function (query, done) {
        $.ajax({
          method: 'GET',
          url: 'api/courses',
          data: input()
        }).then(data => done({ "suggestions": data }))
      },
      onSelect: function (suggestion) {
        that.setState({course: suggestion.value})
      }
    });
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.params.id) {
      this.fetchPost(nextProps.params.id);
    } else {
      this.setState({ ..._defaultState });
    }
  }

  public onImageDrop(files) {
    this.handleImageUpload(files[0]);
  }

  public handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      const transformationPrefix = "http://res.cloudinary.com/dkympkwdz/image/upload/ar_3,c_fill,g_auto,h_700,q_80,w_700/f_jpg/";

      if (response.body.secure_url !== '') {
        if (this.state.img_url1 !== "" && this.state.img_url2 !== "") {
          this.setState({
            img_url3: transformationPrefix + response.body.secure_url.split("/").slice(-1)[0]
          });
        } else if (this.state.img_url1 !== "") {
          this.setState({
            img_url2: transformationPrefix + response.body.secure_url.split("/").slice(-1)[0]
          });
        } else {
          this.setState({
            img_url1: transformationPrefix + response.body.secure_url.split("/").slice(-1)[0]
          });
        }
      }
    });
  }

  public initializeDropzone() {
    $('.dropzone-upload').on('dragenter', function() {
      $(this)
        .css({'background-color' : 'rgba(0,0,0,0.2)'})
    });
    $('.dropzone-upload').on('dragleave', function() {
      $(this)
        .css({'background-color' : 'rgba(0,0,0,0)'})
    });
  }

  public componentDidMount() {
    this.initializeDropzone();
    this.fetchAllCourses();
  }

  public fetchPost(id) {
    const access_token = this.props.user.auth.accessToken;
    $.ajax({
      method: "GET",
      url: `api/posts/${id}`,
      data: { access_token, edit: true }
    }).then(post => {
      this.setState({ ...post })
    })
  }

  public fetchAllCourses() {
    $.ajax({
      method: "GET",
      url: "api/courses"
    }).then(courses => {
      this.setState({ courses })
      this.autoComplete()
    }).fail(errors => {
      this.setState({ errors: errors.responseJSON })
    })
  }

  public updateState(e) {
    let valid_input = "1234567890";

    if (e.target.id === "price") {
      for (var i = 0; i < valid_input.length; ++i) {
        if (e.target.value.includes(valid_input[i]) || e.target.value.length === 0) {
          this.setState({ [e.target.id]: e.target.value })
        }
      }
    } else {
      this.setState({ [e.target.id]: e.target.value })
    }
  }

  public radioButtonsUpdate(type) {
    return e => this.setState({ [type]: e.currentTarget.textContent });
  }

  public submitForm(e) {
    let { title, condition, course, price, description, category, img_url1, img_url2, img_url3 } = this.state;
    if (this.state.category !== "Textbooks") course = "";
    e.preventDefault();
    let method, url;
    if (typeof this.props.params.id === 'undefined') {
      method = "POST";
      url = "api/posts";
    } else {
      method = "PATCH";
      url = `api/posts/${this.props.params.id}`
    }
    const access_token = this.props.user.auth.accessToken;
    $.ajax({
      method: method,
      url: url,
      data: {
        post: { title, condition, price, description, img_url1, img_url2, img_url3 },
        course: { course },
        category: { category },
        access_token
      }
    }).then(post => this.props.router.replace(`posts/${post.id}`))
      .fail(errors => {
        this.setState({ errors: errors.responseJSON })
      })
  }

  public renderErrors() {
    return this.state.errors.map((error, key) => (
      <div key={key} className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span className="sr-only">Error:</span> {error}
      </div>
    ));
  }

  public render() {
    const categories = ['Textbooks', 'Clothing', 'Furniture', 'Electronics', 'Kitchenware', 'Games'];
    const conditions = ['Brand New', "Like New", "Used"];

    return (
      <div className="container">
        {this.renderErrors()}
        <h1 style={paddingLeft} id="heading-custom">
          {this.props.params.id ? `Edit post ${this.state.id}` : "Create a new post"}
        </h1>
        <br/>
        <br/>
        <form className="form-horizontal">

          {/* Category radio buttons */}
          <RadioButtons
            type="category"
            list={categories}
            clickAction={this.radioButtonsUpdate('category')}
            currentValue={this.state.category}
          />

          {/* Condition radio buttons */}
          <RadioButtons
            type="condition"
            list={conditions}
            clickAction={this.radioButtonsUpdate('condition')}
            currentValue={this.state.condition}
          />

          {/* Course dropdown menu */}
          <div className={`form-group ${this.state.category !== "Textbooks" ? "hidden" : ""}`}>
            <label style={labelStyle} htmlFor="inputCourse3" className="col-sm-2 control-label-custom">
              Course
            </label>

            <div className="col-sm-9 input-group" style={paddingAll}>
              <input
                maxLength={50}
                value={this.state.course}
                onChange={ this.updateState }
                type="text"
                className="form-control"
                id="course"
                style={borderStyle}
                placeholder="Type to autocomplete"
              />
              </div>
          </div>

          {/* Post title input */}
          <div className="form-group">
            <label style={labelStyle} htmlFor="inputTitle3" className="col-sm-2 control-label-custom">
              Title
            </label>

            <div className="col-sm-9 input-group" style={morePadding}>
              <input
                maxLength={50}
                value={this.state.title}
                onChange={this.updateState}
                type="text"
                className="form-control"
                id="title"
                required
              />
              <span className="pull-right" id="character-count">
                &nbsp;{50 - this.state.title.length} / 50
              </span>
            </div>
          </div>

          {/* Post description textarea */}
          <div className="form-group">
            <label style={labelStyle} htmlFor="inputDescription3" className="col-sm-2 control-label-custom">Description</label>
            <div className="col-sm-9 input-group" style={morePadding}>
              <textarea
                maxLength={250}
                value={this.state.description}
                onChange={this.updateState}
                className="form-control"
                id="description"
                rows={3}
              >
              </textarea>

              <span className="pull-right" id="character-count">
                {250 - this.state.description.length} / 250
              </span>
            </div>
          </div>

          {/* Price input */}
          <div className="form-group">
            <label style={labelStyle} htmlFor="inputPrice3" className="col-sm-2 control-label-custom">Price</label>
            <div className="col-sm-9 input-group" id="fixed-price" style={paddingBottom}>
              <span className="input-group-addon" id="basic-addon1">$</span>
              <input
                value={this.state.price}
                onChange={ this.updateState }
                className="form-control"
                id="price"
                placeholder="10"
                onKeyDown={e => this.checkKey(e)}
                onKeyUp={e => this.checkKey(e)}
              />
              <span className="input-group-addon" id="basic-addon1" style={noBorder}>.00</span>
            </div>
          </div>

          {/* Post images */}
          <div className="form-group">
            <label style={labelStyle} htmlFor="inputImage3" className="col-sm-2 control-label-custom">
              Image(s) <br/> (required 1)
            </label>

            <ImageDropzone img_url={this.state.img_url1} onImageDrop={this.onImageDrop} />
            <ImageDropzone img_url={this.state.img_url2} onImageDrop={this.onImageDrop} />
            <ImageDropzone img_url={this.state.img_url3} onImageDrop={this.onImageDrop} />

          </div>

          {/* Submit button */}
          <div className="form-group">
            <div className="col-sm-9 col-sm-offset-2">
              <button onClick={this.submitForm} type="button" className="btn btn-primary btn-lg btn-block">
                {this.props.params.id ? "Update" : "Create"}
              </button>
              <br/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default PostForm;