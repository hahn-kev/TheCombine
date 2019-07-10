﻿using BackendFramework.Controllers;
using BackendFramework.Interfaces;
using BackendFramework.ValueModels;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System;
using System.IO;

namespace Backend.Tests
{
    public class AvatarControllerTests
    {
        private IUserService _userService;
        private UserController _userController;
        private AvatarController _avatarController;

        [SetUp]
        public void Setup()
        {
            _userService = new UserServiceMock();
            _userController = new UserController(_userService);
            _avatarController = new AvatarController(_userService);
        }

        string RandomString(int length = 0)
        {
            if (length == 0)
            {
                return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            }
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, length);
        }

        User RandomUser()
        {
            User user = new User();
            user.Username = RandomString(4);
            user.Password = RandomString(4);
            return user;
        }

        [Test]
        public void TestAvatarImport()
        {//yell at mark if this makes it to the pull request
            string filePath = Path.Combine(Directory.GetParent(Directory.GetParent(Directory.GetParent(Environment.CurrentDirectory).ToString()).ToString()).ToString(), "Assets", "combine.png");

            FileStream fstream = File.OpenRead(filePath);

            FormFile formFile = new FormFile(fstream, 0, fstream.Length, "dave", "combine.png");
            FileUpload fileUpload = new FileUpload();
            fileUpload.Name = "FileName";
            fileUpload.File = formFile;

            User user = _userService.Create(RandomUser()).Result;

            _ = _avatarController.UploadAvatar(user.Id, fileUpload).Result;

            var action = _userController.Get(user.Id).Result;

            var foundUser = (action as ObjectResult).Value as User;
            Assert.IsNotNull(foundUser.Avatar);
        }
    }
}