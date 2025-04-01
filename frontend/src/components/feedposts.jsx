// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../config/axios";
// import PostCard from "./postcard";

// const Feedposts = () => {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       if (loading || page > totalPages) return;

//       setLoading(true);
//       try {
//         const response = await axiosInstance.get(`/posts`, {
//           params: { page, limit: 10 },
//         });

//         setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
//         setTotalPages(response.data.totalPages);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [page]); // Fetch posts whenever the page number changes

//   return (
//     <div className="bg-gray-50 shadow-lg"> {/* Removed dark background, made background professional with gray tone */}
//       <div className="mt-5 px-5">
//         {posts.map((post, index) => (
//           <div className="mb-5" key={post._id || index}>
//             <PostCard
//               profilePicture={post.user?.profilePicture}
//               name={post.user?.name}
//               bio={post.user?.bio}
//               description={post.content}
//               postImage={post.image}
//               initialLikes={post.likes.length}
//               initialComments={post.comments.length}
//               initialSaves={post.saves?.length || 0}
//               postId={post._id}
//               commentsData={post.comments}
//               username={post.user?.username}
//             />
//           </div>
//         ))}

//         {loading && (
//           <div className="flex justify-center items-center mt-4">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//           </div>
//         )}

//         {page <= totalPages && !loading && (
//           <div className="text-center mt-5">
//             <button
//               onClick={() => setPage((prevPage) => prevPage + 1)}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
//               disabled={loading}
//             >
//               {loading ? "Loading..." : "Load More"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Feedposts;


import React from 'react'

const feedposts = () => {
  return (
    <div>
      
    </div>
  )
}

export default feedposts
