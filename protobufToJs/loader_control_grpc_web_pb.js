/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./loader_control_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.LoaderCmdClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.LoaderCmdPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.MetaAction,
 *   !proto.Response>}
 */
const methodDescriptor_LoaderCmd_meta_cmd = new grpc.web.MethodDescriptor(
  '/LoaderCmd/meta_cmd',
  grpc.web.MethodType.UNARY,
  proto.MetaAction,
  proto.Response,
  /**
   * @param {!proto.MetaAction} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Response.deserializeBinary
);


/**
 * @param {!proto.MetaAction} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.LoaderCmdClient.prototype.meta_cmd =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/LoaderCmd/meta_cmd',
      request,
      metadata || {},
      methodDescriptor_LoaderCmd_meta_cmd,
      callback);
};


/**
 * @param {!proto.MetaAction} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Response>}
 *     Promise that resolves to the response
 */
proto.LoaderCmdPromiseClient.prototype.meta_cmd =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/LoaderCmd/meta_cmd',
      request,
      metadata || {},
      methodDescriptor_LoaderCmd_meta_cmd);
};


module.exports = proto;

