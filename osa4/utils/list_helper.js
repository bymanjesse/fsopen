function dummy(blogs) {
    return 1;
  }
  
  module.exports = {
    dummy,
  };

  function totalLikes(blogs) {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  }
  
  module.exports = {
    dummy,
    totalLikes,
  };

  function favoriteBlog(blogs) {
    let favorite = null;
  
    blogs.forEach((blog) => {
      if (favorite === null || blog.likes > favorite.likes) {
        favorite = {
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
        };
      }
    });
  
    return favorite;
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
  };