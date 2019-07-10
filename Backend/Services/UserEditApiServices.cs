using BackendFramework.Interfaces;
using BackendFramework.ValueModels;
using System;
using System.Threading.Tasks;

namespace BackendFramework.Services
{
    public class UserEditService : IUserEditService
    {
        private readonly IUserEditRepository _repo;

        public UserEditService(IUserEditRepository repo)
        {
            _repo = repo;
        }

        public async Task<Tuple<bool, int>> AddGoalToUserEdit(string projectId, string userEditId, Edit edit)
        {
            //get userEdit to change
            var userEntry = await _repo.GetUserEdit(projectId, userEditId);

            UserEdit newUserEdit = userEntry.Clone();

            //add the new goal index to Edits list
            newUserEdit.Edits.Add(edit);

            //replace the old UserEdit object with the new one that contains  the new list entryz
            bool validation = _repo.Replace(projectId, userEditId, newUserEdit).Result;

            int indexOfNewestEdit = -1;

            if (validation)
            {
                var newestEdit = _repo.GetUserEdit(projectId, userEditId).Result;
                indexOfNewestEdit = newestEdit.Edits.Count -1;
            }

            return new Tuple<bool, int>(validation, indexOfNewestEdit);
        }

        public async Task<bool> AddStepToGoal(string projectId, string userEditId, int goalIndex, string userEdit)
        {
            UserEdit addUserEdit = await _repo.GetUserEdit(projectId, userEditId);

            UserEdit newUserEdit = addUserEdit.Clone();

            newUserEdit.Edits[goalIndex].StepData.Add(userEdit);

            bool updateResult = _repo.Replace(projectId, userEditId, newUserEdit).Result;

            return updateResult;
           
        }
    }
}