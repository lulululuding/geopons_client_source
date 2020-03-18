export const ME_QUERY = `
{
  me {
    _id
    name
    email
    picture
  }
}
`;

export const GET_VERIFY = `
  query($phoneNum: String!) {
    verify (phoneNum:$phoneNum){
      res
    }
  }
`;

export const GET_PINS_QUERY = `
  {
    getPins {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`;
